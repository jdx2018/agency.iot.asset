package com.supdatas.asset.frame.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.supdatas.asset.R;

public class MenuAdapter extends BaseAdapter {

	private Context mContext;
	private int[] iconIds;
	private int[] nameIds;

	public MenuAdapter(Context context, int[] iconIds, int[] nameIds) {
		mContext = context;
		this.iconIds = iconIds;
		this.nameIds = nameIds;
	}
	
	public void setData(Context context, int[] iconIds, int[] nameIds){
		mContext = context;
		this.iconIds = iconIds;
		this.nameIds = nameIds;
		this.notifyDataSetChanged();
	}

    public void setNotificationNumInfo() {

        this.notifyDataSetChanged();
    }

	@Override
	public int getCount() {
		// TODO Auto-generated method stub
		return iconIds == null ? 0 : iconIds.length;
	}

	@Override
	public Object getItem(int position) {
		// TODO Auto-generated method stub
		return iconIds[position];
	}

	@Override
	public long getItemId(int position) {
		// TODO Auto-generated method stub
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		// TODO Auto-generated method stub
		ViewHolder holder = null;
		if (convertView == null) {
			holder = new ViewHolder();
			convertView = LayoutInflater.from(mContext).inflate(
					R.layout.layout_grid_item_menu, null);
			holder.ivIcon = (ImageView) convertView.findViewById(R.id.iv_icon);
			holder.tvTitle = (TextView) convertView.findViewById(R.id.tv_title);
			holder.tvNotificationNum = (TextView) convertView
					.findViewById(R.id.tv_notification_num);

			convertView.setTag(holder);
		} else {
			holder = (ViewHolder) convertView.getTag();
		}

		holder.ivIcon.setBackgroundResource(iconIds[position]);
		holder.tvTitle.setText(nameIds[position]);

		/*if (2 == position && 0 < notificationNumInfo.iBillNum) {
			holder.tvNotificationNum.setVisibility(View.VISIBLE);
			holder.tvNotificationNum.setText(String
					.valueOf(notificationNumInfo.iBillNum));
		} else */{
			holder.tvNotificationNum.setVisibility(View.INVISIBLE);
		}

		return convertView;
	}

	public final class ViewHolder {
		public ImageView ivIcon;
		public TextView tvTitle;
		public TextView tvNotificationNum;

	}

}
